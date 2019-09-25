<?php

namespace App\Console\Commands;

use App\Jobs\ProcessBooks;
use Illuminate\Console\Command;

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
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        ProcessBooks::dispatchNow();
    }
}
