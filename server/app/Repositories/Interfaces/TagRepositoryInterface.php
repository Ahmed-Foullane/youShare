<?php

namespace App\Repositories\Interfaces;

interface TagRepositoryInterface 
{
    public function search(string $query);
}