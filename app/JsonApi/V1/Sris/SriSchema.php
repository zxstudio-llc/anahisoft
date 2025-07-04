<?php

namespace App\JsonApi\V1\Sris;

use App\Models\Sri;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\ArrayList;
use LaravelJsonApi\Eloquent\Fields\Map;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class SriSchema extends Schema
{
    /**
     * The model the schema corresponds to.
     */
    public static string $model = Sri::class;

    /**
     * Get the resource fields.
     */
    public function fields(): array
    {
        return [
            ID::make(),
    
            Str::make('identification')->readOnly(),
    
            Map::make('contributor', [
                'identification' => Str::make('identification'),
                'business_name' => Str::make('business_name'),
                'type' => Str::make('type'),
                'class' => Str::make('class'),
                'id_type' => Str::make('id_type'),
                'resolution' => Str::make('resolution'),
                'commercial_name' => Str::make('commercial_name'),
                'head_office_address' => Str::make('head_office_address'),
                'info_date' => Number::make('info_date'),
                'message' => Str::make('message'),
                'status' => Str::make('status'),
            ])->readOnly(),
    
            Map::make('debt', [
                'description' => Str::make('description'),
                'amount' => Number::make('amount'),
                'fiscal_period' => Str::make('fiscal_period'),
                'beneficiary' => Str::make('beneficiary'),
                'detail' => Str::make('detail'),
            ])->readOnly(),
    
            Map::make('challenge', [])->readOnly(),
            Map::make('remission', [])->readOnly(),
    
            Map::make('ruc_info', [
                'legal_name' => Str::make('legal_name'),
                'ruc' => Str::make('ruc'),
                'trade_name' => Str::make('trade_name'),
                'taxpayer_status' => Str::make('taxpayer_status'),
                'taxpayer_class' => Str::make('taxpayer_class'),
                'taxpayer_type' => Str::make('taxpayer_type'),
                'must_keep_accounting' => Str::make('must_keep_accounting'),
                'main_activity' => Str::make('main_activity'),
                'start_date' => Str::make('start_date'),
                'end_date' => Str::make('end_date'),
                'restart_date' => Str::make('restart_date'),
                'update_date' => Str::make('update_date'),
                'mipymes_category' => Str::make('mipymes_category'),
                'establecimiento' => ArrayList::make('establishment'),
                'error' => Str::make('error'),
            ])->readOnly(),
        ];
    }
    


    /**
     * Get the resource filters.
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
        ];
    }

    /**
     * Get the resource paginator.
     */
    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }
}