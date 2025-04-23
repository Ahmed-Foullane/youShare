<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Interfaces\CrudRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Exception;

class CrudRepository implements CrudRepositoryInterface
{

    protected $model;

    public function __construct(Model $model){
        $this->model = $model;
    }

    public function all(){
        return $this->model->all();
    }

    public function find(int $id): Model{
        return $this->model->find($id);
    }

    public function create(array $data): Model{
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model{
        $record = $this->find($id);

        if (!$record) {
            throw new Exception("id: {$id} not found");
        }

        $record->update($data);
        return $record->fresh();
    }

    public function delete(int $id): bool{
        $record = $this->find($id);

        if (!$record) {
            throw new Exception("id: {$id} not found");
        }

        return $record->delete();
    }
}
