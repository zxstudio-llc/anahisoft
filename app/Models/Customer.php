<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;

class Customer extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */

    use HasFactory;
    use Notifiable;
    use HasRoles;

    protected $table = 'customers';
    protected $guard_name = 'customer';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'address',
        'dni',
        'gender',
        'image',
        'date_of_birth',
        'email',
        'phone',
        'password',
        'subscribed_to_news_letter',
        'status',
        'is_verified',
        'is_suspended',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function hasVerifiedEmail()
    {
        return !is_null($this->email_verified_at);
    }

    public function bingoCards(): HasMany
    {
        return $this->hasMany(BingoCard::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoices::class);
    }

    /**
     * Get the total amount of all invoices.
     */
    public function getTotalInvoicedAmount(): float
    {
        return $this->invoices()->sum('total_amount');
    }

    /**
     * Get the total amount of paid invoices.
     */
    public function getTotalPaidAmount(): float
    {
        return $this->invoices()->paid()->sum('total_amount');
    }

    /**
     * Get the total amount of outstanding invoices.
     */
    public function getOutstandingAmount(): float
    {
        return $this->getTotalInvoicedAmount() - $this->getTotalPaidAmount();
    }
}
