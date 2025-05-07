<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateProfileImageRequest extends FormRequest
{
    
    public function authorize(){
        return true;
    }

  
    public function rules(){
        return [
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }


    public function messages(){
        return [
            'profile_image.required' => 'A profile image is required',
            'profile_image.image' => 'The file must be an image',
            'profile_image.mimes' => 'The image must be a file of type: jpeg, png, jpg, gif',
            'profile_image.max' => 'The image size must not exceed 2MB',
        ];
    }
}