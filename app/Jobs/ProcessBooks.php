<?php

namespace App\Jobs;

use App\Book;
use App\Category;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use \Goutte\Client as GoutteClient;

class ProcessBooks implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;


    private $url = 'http://books.toscrape.com/';

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->client = new GoutteClient();
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $crawler = $this->client->request('GET', $this->url);

        // dump($crawler);

        // Get the latest post in this category and display the titles
        $crawler->filter('.side_categories ul ul a')->each(function ($node) {
            $name = trim($node->text());

            Category::updateOrCreate(
                ['name' => $name,],
                ['name' => $name,]
            );
        });

        $crawler->filter('section article a')->each(function ($node) {

            $link = $node->link();

            $crawler = $this->client->click($link);

            $categoryId = $this->getCategoryId($crawler->filter('.breadcrumb li')->eq(2));
            $title = trim($crawler->filter('h1')->text());
            $description = trim($crawler->filter('article > p')->text());
            $image = $crawler->filter('.thumbnail img')->image()->getUri();
            $price = $this->getPrice($crawler->filter('.price_color'));
            $currency = '£';
            $rating = $this->getRating($crawler->filter('.star-rating'));
            $upc = $crawler->filter('.table tr')->eq(0)->filter('td')->text();

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

        if (strpos($p, '£') !== false) {
            $currency = '£';
        }

        $price = str_replace('£', '', $p);

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
