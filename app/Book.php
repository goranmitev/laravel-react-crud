<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    public $fillable = [
        'title',
        'category_id',
        'description',
        'image',
        'price',
        'currency',
        'rating',
        'upc'
    ];
}
