<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CommentRequest extends FormRequest
{
    
    public function authorize(){
        return true;
    }

    public function rules(){
        return [
            'content' => 'required|string|min:3',
            'question_id' => 'required_without:article_id|exists:questions,id|nullable',
            'article_id' => 'required_without:question_id|exists:articles,id|nullable',
            'parent_id' => 'nullable|exists:comments,id' 
        ];
    }



    public function messages(){
        return [
            'content.required' => 'Comment content is required',
            'content.min' => 'Comment must be at least 3 characters long',
            'question_id.required_without' => 'A question or article must be specified',
            'article_id.required_without' => 'A question or article must be specified',
            'question_id.exists' => 'The selected question does not exist',
            'article_id.exists' => 'The selected article does not exist',
            'parent_id.exists' => 'The parent comment does not exist'
        ];
    }

    
}