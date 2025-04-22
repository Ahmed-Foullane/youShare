<?php

namespace App\Repositories\Interfaces;



interface CategoryRepositoryInterface 
{
    
    public function search(string $query);
    public function getCategoriesWithArticleCount();
}