<?php

namespace Database\Factories;

use App\Models\Card;
use App\Models\CardList;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\=Card>
 */
class CardFactory extends Factory
{

    protected $model = Card::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'order' => $this->faker->numberBetween(1, 20),
            'list_id' => CardList::factory(),
            'owner_id' => User::factory(),
        ];
    }
}