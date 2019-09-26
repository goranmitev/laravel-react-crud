<?php

namespace App\Http\Controllers;

use App\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $query = Book::query();

        $query->with('category:id,name');

        $data = $query->paginate();

        // $data->map(function ($book, $key) {

        //     $actions = [];

        //     $actions[] = ['name' => 'View', 'url' => route('books.show', ['book'=>$book])];

        //     // $actions[] = ['name' => 'Edit', 'url' => route('books.edit', ['book' => $book])];

        //     $actions[] = [
        //         'name' => 'Delete',
        //         'url' => route('books.destroy', ['book' => $book]),
        //         'method' => 'DELETE',
        //         'type' => 'form'
        //     ];

        //     $book->actions = $actions;

        //     $book->price = $book->currency . $book->price;

        //     return $book;
        // });

        return response()->json(
            $data->toArray()
        );
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
