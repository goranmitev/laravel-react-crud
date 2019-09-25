<?php

namespace App\Console\Commands;

use App\Book;
use App\Category;
use Illuminate\Console\Command;

use \Goutte\Client as GoutteClient;
use Log;

class ProcessBooksCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'process:books';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process books description';

    /**
     * The url to start with
     *
     * @var string
     */
    private $url = 'http://books.toscrape.com/';

    /**
     * GoutteClient
     *
     */
    private $client;

    private $exchangeRate = 1.25;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->client = new GoutteClient();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $crawler = $this->client->request('GET', $this->url);

        $this->currentUrl = $this->url;

        // Get the latest post in this category and display the titles
        $crawler->filter('.side_categories ul ul a')->each(function ($node) {
            $name = trim($node->text());

            Category::updateOrCreate(
                ['name' => $name,],
                ['name' => $name,]
            );
        });

        do {

            Log::info($this->currentUrl);

            $next = $crawler->filter('.pager .next a');

            $this->currentUrl = $next->getUri();

            $this->warn("Current URL: ".$this->currentUrl);

            $crawler->filter('.product_pod h3 a')->each(function ($node) {

                $link = $node->link();

                $crawler = $this->client->click($link);

                $categoryId = $this->getCategoryId($crawler->filter('.breadcrumb li')->eq(2));
                $title = trim($crawler->filter('h1')->text());
                $description = trim($crawler->filter('article > p')->text());
                $image = $crawler->filter('.thumbnail img')->image()->getUri();
                $price = $this->getPrice($crawler->filter('.price_color'));
                $currency = '$';
                $rating = $this->getRating($crawler->filter('.star-rating'));
                $upc = $crawler->filter('.table tr')->eq(0)->filter('td')->text();

                $this->info($title);

                Book::updateOrCreate(
                    [
                        'title' => $title
                    ],
                    [
                        'title' => $title,
                        'category_id' => $categoryId,
                        'description' => $description,
                        'image' => $image,
                        'price' => $price,
                        'currency' => $currency,
                        'rating' => $rating,
                        'upc' => $upc
                    ]
                );
            });

            if ($next->count() > 0) {
                $crawler = $this->client->click($next->link());
            }

        } while ($next->count() > 0);


    }


    public function getCategoryId($node)
    {
        $categoryName = trim($node->text());

        $category = Category::where([
            'name' => $categoryName
        ])->first();

        if ($category) {
            return $category->id;
        }

        return 0;

    }

    public function getPrice($node)
    {
        $p = $node->text();

        $price = str_replace('£', '', $p);

        $price = $this->exchangeRate * ((float) $price);

        return $price;
    }

    public function getRating($node)
    {
        $ratingClass = $node->attr('class');
        $ratingParts = explode(' ', $ratingClass);
        $rating = 0;
        if (in_array('One', $ratingParts)) {
            $rating = 1;
        }
        if (in_array('Two', $ratingParts)) {
            $rating = 2;
        }
        if (in_array('Three', $ratingParts)) {
            $rating = 3;
        }
        if (in_array('Four', $ratingParts)) {
            $rating = 4;
        }
        if (in_array('Five', $ratingParts)) {
            $rating = 5;
        }

        return $rating;
    }
}
