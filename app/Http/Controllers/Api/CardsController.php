<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Card;


class CardsController extends Controller
{

    public function index($user)
    {

        $cards = Card::where('user', $user)->orderBy('id');


        $stats = collect(
            [
                'downloaded' => (int) $cards->sum('downloaded'),
                'shared' => (int) $cards->sum('shared'),
            ]
        );


        $data = $stats->merge($cards->paginate(2));

        return $data;
    }

    public function single($card)
    {
        $data = Card::where('name', $card)->first()->data;

        return unserialize($data);
    }

    public function show($card)
    {
        return Card::where('name', $card);
    }

    public function store(Request $request)
    {


        $card = '';

        if ($request->id) {
            $card = Card::find($request->id);
        } else {
            $card = New Card;
        }


        foreach ($request->all() as $key => $value) {
            if ($key === 'data')
                $card[$key] = serialize($value);
            else
                $card[$key] = $value;
        }

        $card->save();


        return response()->json([
            'toast' => "Карточка $card->name успешно создана",
            'id' => $card->id
        ]);
    }

    public function destroy($id){
        Card::find($id)->delete();
    }
}
