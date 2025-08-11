<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class CreateHealthMetricsTable extends Migration
{
    public function up()
    {
        Schema::create('health_metrics', function (Blueprint $table) {
            $table->increments('id');  // int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->integer('user_id')->unsigned();
            $table->string('metric_type', 50);
            $table->string('name', 100);
            $table->string('unit', 20);
            $table->float('value');
            $table->timestamp('recorded_at')->default(DB::raw('CURRENT_TIMESTAMP'));

            $table->index('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('health_metrics');
    }
}
