<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{

    public $fillable = ['name'];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }
}
