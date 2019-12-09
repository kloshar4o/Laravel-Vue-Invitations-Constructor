<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ImageType extends Model
{
    //

    public function Images(){
        return $this->hasMany('App\Image','image_types_id', 'id');
    }
}
