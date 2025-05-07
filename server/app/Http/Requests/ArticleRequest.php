<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class ArticleRequest extends FormRequest
{
   
    public function authorize(){
        return true; 
    }

    
    public function rules(){
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'image' => 'nullable', 
        ];
    }



    
    public function messages(){
        return [
            'title.required' => 'The article title is required',
            'content.required' => 'The article content is required',
            'category_id.required' => 'Please select a category',
            'category_id.exists' => 'The selected category does not exist',
            'tags.*.exists' => 'One or more selected tags do not exist',
            'image.image' => 'The file must be an image',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif',
            'image.max' => 'The image size must not exceed 2MB',
            'image.string' => 'The image must be a valid string',
        ];
    }

    
   
}