<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class QuestionRequest extends FormRequest
{
  
    public function authorize(){
        return true;
    }

    public function rules(){
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

 
    protected function failedValidation(Validator $validator){
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
        );
    }

 
    public function messages(){
        return [
            'title.required' => 'The question title is required',
            'title.max' => 'The question title cannot exceed 255 characters',
            'description.required' => 'The question description is required',
            'description.min' => 'The question description must be at least 10 characters',
            'tags.*.exists' => 'One or more selected tags do not exist',
            'image.image' => 'The file must be an image',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif',
            'image.max' => 'The image size must not exceed 2MB',
        ];
    }

    
}