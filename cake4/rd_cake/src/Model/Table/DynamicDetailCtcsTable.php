<?php

// src/Model/Table/DynamicDetailCtcsTable.php

namespace App\Model\Table;
use Cake\ORM\Table;

class DynamicDetailCtcsTable extends Table{
    public function initialize(array $config):void{  
        $this->addBehavior('Timestamp');       
        $this->belongsTo('DynamicDetails'); 
    }     
}
