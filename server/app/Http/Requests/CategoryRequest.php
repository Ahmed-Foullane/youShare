<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CategoryRequest extends FormRequest
{
   
    public function authorize(){
        return true; 
    }

    
    public function rules(){
        $rules = [
            'name' => 'required|string|max:50|unique:categories,name',
        ];

        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['name'] = 'required|string|max:50|unique:categories,name,' . $this->route('id');
        }

        return $rules;
    }

   

   
    public function messages(){
        return [
            'name.required' => 'The category name is required',
            'name.max' => 'The category name cannot exceed 50 characters',
            'name.unique' => 'This category name already exists',
        ];
    }

   
    
}