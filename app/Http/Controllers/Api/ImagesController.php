<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Image;
use App\ImageType;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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

        foreach ($images as $image) {
            switch ($image->type) {
                case 'img':
                case 'background':
                    $image->accepted = '.jpg, .jpeg, .png';
                    break;
                case 'svg':
                    $image->accepted = '.svg';
                    break;
            }
        }

        return $images;
    }

    public function update(Request $request)
    {

        $images = $request->all();

        foreach ($images as $imageValues) {

            $imageData = Image::find($imageValues['id']);

            foreach ($imageValues as $key => $value) {
                $imageData[$key] = $value;
            }

            $imageData->save();
        }

        return;

    }

    public function save(Request $request)

    {
        $file = $request->file;
        $fileFolder = $request->folder;
        $fileName = $file->getClientOriginalName();

        $validator = Validator::make(
            $request->all(),
            ['file' => 'required|mimes:jpeg,png,jpg,gif,svg|max:20000'],
            ['mimes' => $fileName . ' должен быть одного из следующих типов: :values.']
        );


        //Validate type
        if ($validator->fails()) {
            return response()->json([
                'messeges' => $validator->errors(),

            ], 422);
        }


        //Validate if exist
        $exists = Storage::disk('images')
            ->exists("$fileFolder/$fileName");

        if ($exists)
            return response()->json([
                'toast' => [
                    'message' => "Файл $fileName уже существует",
                    'type' => 'error',
                    'duration' => 20000
                ]
            ]);
        else
            Storage::disk('images')
                ->putFileAs($fileFolder, $file, $fileName);



        $image = New Image;

        $image->src = "img/$fileFolder/$fileName";
        $image->image_types_id = $request->cat;
        $image->sort = $request->sort;
        $image->show_client = 1;
        $image->show_consultant = 1;
        $image->save();


        return response()->json([
            'toast' => "Файл $fileName загружен",
            'image' => $image
        ]);

    }

    public function destroy(Request $image){
        $id = $image->id;
        $path = $image->src;

        Storage::disk('constructor')
            ->delete($path);

        Image::find($id)
            ->delete();
        return;
    }


}
