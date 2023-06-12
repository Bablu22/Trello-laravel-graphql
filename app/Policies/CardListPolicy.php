<?php

namespace App\Policies;

use App\Models\CardList;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class CardListPolicy
{
    use HandlesAuthorization;
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, CardList $cardList): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, CardList $cardList): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, CardList $cardList): bool
    {
        return $user->id === $cardList->board->owner_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, CardList $cardList): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, CardList $cardList): bool
    {
        //
    }

    /**
     * Determine whether the user can careare a card  the model.
     */
    public function createCard(User $user, CardList $cardList): bool
    {
        return $user->id === $cardList->board->owner_id;
    }


}