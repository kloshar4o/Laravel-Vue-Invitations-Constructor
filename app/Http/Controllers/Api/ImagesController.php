<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ImageResource;
use Illuminate\Http\Request;
use App\Image;
use App\ImageType;

class ImagesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $books = ImageType::with([

            'images' => function ($query) {
                $query->orderBy('sort');
            },
        ])
            ->orderBy('sort')
            ->get();


        return $books;
    }

    public function sort(Request $request)
    {

        $images = $request->all()['images'];

        foreach ($images as $image) {

            $imageData = Image::find($image['id']);
            $imageData->sort = $image['sort'];
            $imageData->save();
        }

        return ['message' => 'Сортировка сохранена'] ;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
