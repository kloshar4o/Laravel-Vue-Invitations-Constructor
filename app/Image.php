<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    //
    public function Type()
    {
        return $this->belongsTo('App\ImageType', 'id', 'image_types_id');
    }
}
