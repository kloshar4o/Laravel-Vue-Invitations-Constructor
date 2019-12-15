<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    //
    protected $fillable = [
        'name', 'user', 'downloaded','shared','data'
    ];
}
