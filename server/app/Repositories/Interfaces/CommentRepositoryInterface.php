<?php

namespace App\Repositories\Interfaces;


interface CommentRepositoryInterface extends CrudRepositoryInterface
{

    public function getByQuestion(int $questionId);

    public function markAsAccepted(int $commentId);

    public function unmarkAsAccepted(int $commentId);
}
