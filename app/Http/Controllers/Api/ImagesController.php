<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ImageResource;
use Illuminate\Http\Request;
use App\Image;
use App\ImageType;


class ImagesController extends Controller
{
    public function index()
    {
        $images = ImageType::with([

            'images' => function ($query) {
                $query->orderBy('sort');
            },
        ])
            ->orderBy('sort')
            ->get();


        return $images;
    }

    public function sort(Request $request)
    {

        $images = $request->all()['images'];

        foreach ($images as $image) {

            $imageData = Image::find($image['id']);
            $imageData->sort = $image['sort'];
            $imageData->save();
        }

        return response()->json(['message' => 'Сортировка сохранена']);

    }

    public function save(Request $request)

    {

        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);


        $file = $request->file;
        $fileFolder = $request->folder;
        $fileName = $file->getClientOriginalName();


        $request->file->move(public_path("img/$fileFolder/"), $fileName);

        $image = New Image;


        $image->src = "img/$fileFolder/$fileName";
        $image->image_types_id = $request->cat;
        $image->sort = $request->sort;
        $image->show_client = 1;
        $image->show_consultant = 1;
        $image->save();



        return response()->json(['message' => "Файл $fileName загружен", 'image' => $image]);

    }


}
