<?php

namespace App\Http\Controllers;

use App\Book;
use App\Category;
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
        $rules = array(
            'title' => 'required|unique:books',
            'description' => 'required',
            'category_id' => 'integer|required',
            'price' => 'numeric|required',
            'upc' => 'required'
        );

        $data = $request->validate($rules);

        $book = new Book();

        $book->title = $request->title;
        $book->category_id = $request->category_id;
        $book->description = $request->description;
        $book->price = $request->price;
        $book->currency = $request->currency;
        $book->upc = $request->upc;
        $book->save();


        return response()->json([
            'id' => $book->id,
            'success' => true
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $book = Book::find($id);

        $categories = Category::all();

        $book->load('category:id,name');

        return response()->json([
            'book' =>  $book,
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Book $book)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Book $book)
    {

        $rules = array(
            'title' => 'required|unique:books,title,'.$book->id,
            'description' => 'required',
            'category_id' => 'integer|required',
            'price' => 'numeric|required',
            'upc' => 'required'
        );

        $data = $request->validate($rules);

        $book->title = $request->title;
        $book->category_id = $request->category_id;
        $book->description = $request->description;
        $book->price = $request->price;
        $book->upc = $request->upc;
        $book->save();

        return response()->json([
            'book' => $book,
            'success' => true
        ]);

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

    public function categories()
    {
        $categories = Category::all();

        return response()->json([
            'categories' => $categories
        ]);
    }
}
