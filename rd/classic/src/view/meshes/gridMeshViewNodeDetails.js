/*-----------------------------------------------------------
  File: rd/app/view/meshes/gridMeshViewNodeDetails.js
 
--------------------------------------------------------------------------- */
Ext.define('Rd.view.meshes.gridMeshViewNodeDetails' ,{
    extend		:'Ext.grid.Panel',
    alias 		: 'widget.gridMeshViewNodeDetails',
    multiSelect	: true,
    stateful	: true,
    stateId		: 'StateGMVND',
    stateEvents:['groupclick','columnhide'],
    border		: false,
	requires    : [
		'Rd.view.components.ajaxToolbar',
        'Rd.store.sNodeDetails',
        'Rd.model.mNodeDetail',
        'Ext.toolbar.Paging',
        'Ext.ux.ProgressBarPager'
    ],
    viewConfig	: {
        loadMask	:true
    },
    urlMenu		: '/cake4/rd_cake/meshes/menu_for_node_details_grid.json',
    plugins     : [
        {
            ptype: 'rowexpander',
            rowBodyTpl : new Ext.XTemplate(
                '<div style="color:#2255ce;  background-color:#aeaeae; padding:5px;">',
                '<img src="/cake4/rd_cake/img/hardwares/{hw_photo}" alt="{hw_human}" style="float: left; padding-right: 20px;">',
                '<h2>{name}</h2>',
                '<span>{hw_human}</span>',
                '</div>',
                '<div class="sectionHeader">',
                    '<h2>DEVICE INFORMATION</h2>',
                '</div>',
                "<div style='background-color:white; padding:5px;'>",
                    "<label class='lblMap'>MESH IP  </label><label class='lblValue'>{ip}</label>",
					"<div style='clear:both;'></div>",
					"<label class='lblMap'>Main MAC </label><label class='lblValue'> {mac}</label>",
					"<div style='clear:both;'></div>",
                    "<label class='lblMap'>Description </label><label class='lblValue'> {description}</label>",
					"<div style='clear:both;'></div>",
                    "<label class='lblMap'>On public maps </label><label class='lblValue'> {on_public_maps}</label>",
					"<div style='clear:both;'></div>",
					"<label class='lblMap'>Status </label>",
                    "<tpl if='state == \"down\"'><label class='lblValue txtRed'><i class='fa fa-exclamation-circle'></i> Last contact {last_contact_human}</label></tpl>",
                    "<tpl if='state == \"up\"'><label class='lblValue txtGreen'><i class='fa fa-check-circle'></i> Last contact {last_contact_human}</label></tpl>",
					"<div style='clear:both;'></div>",
                    "<label class='lblMap'>Uptime </label><label class='lblValue'> {uptime}</label><br>",
                    "<tpl if='gateway == \"yes\"'>",
                        '<ul class="fa-ul">',
                            "<li style='color:blue;'><i class='fa-li fa fa-info-circle'></i>LAN IP: {lan_ip} LAN Gateway: {lan_gw}  ({lan_proto}) </li>",
                            "<li style='color:blue;'><i class='fa-li fa fa-link'></i>Reports using IP {last_contact_from_ip} </li>",
                        '</ul>',
                    "</tpl>",
                "</div>"
            )
        }
    ],
    initComponent: function(){
        var me      = this;
        me.store    = Ext.create(Rd.store.sNodeDetails,{});
        me.store.getProxy().setExtraParam('mesh_id',me.meshId);   
        me.tbar     = Ext.create('Rd.view.components.ajaxToolbar',{'url': me.urlMenu});
        
        me.bbar = [{
            xtype       : 'pagingtoolbar',
            store       : me.store,
            displayInfo : true,
            plugins     : {
                'ux-progressbarpager': true
            }
        }];
        
        me.columns  = [
        //    {xtype: 'rownumberer',stateId: 'StateGMVND1'},           
            { 
                text        : i18n('sName'),   
                dataIndex   : 'name',  
                tdCls       : 'gridTree',
                flex        : 1,
                renderer    : function(value,metaData, record){
                	var gateway     = record.get('gateway');
                	var reboot_flag = record.get('reboot_flag');
                	var rb_string   = '';
                	if(reboot_flag == 1){
                	    rb_string = "<i class=\"fa fa-power-off\" style=\"color:orange;\"></i>";
                	}
                    if(gateway == 'yes'){
                        return "<div class=\"fieldGreyWhite\" style=\"text-align:left;\">"+rb_string+"  "+value+"</div>";
                    }
                    if(gateway == 'no'){
                        return "<div class=\"fieldGrey\" style=\"text-align:left;\">"+rb_string+"  "+value+"</div>";
                    }  	             
                },
                stateId: 'StateGMVND2'
            },
            { text: i18n('sDescription'),       dataIndex: 'description',   tdCls: 'gridTree', flex: 1,stateId: 'StateGMVND3', hidden : true},
            { text: i18n('sMAC_address'),       		dataIndex: 'mac',           tdCls: 'gridTree', flex: 1,stateId: 'StateGMVND4'},           
            { 
				text		: i18n('sHardware'),      
				dataIndex	: 'hardware',     
				tdCls		: 'gridTree', 
				flex		: 1,
				xtype       :  'templatecolumn', 
                tpl         :  new Ext.XTemplate(
                    '{hw_human}'
                ),
                hidden      : true,
				stateId     : 'StateGMVND5'
			},
            { text: i18n('sPower'),             dataIndex: 'power',         tdCls: 'gridTree', flex: 1,stateId: 'StateGMVND6', hidden : true},
            { text: i18n('sIP_Address'),        dataIndex: 'ip',            tdCls: 'gridTree', width: 110,stateId: 'StateGMVND7',
            
                hidden : true
            
            },
			{ text: i18n('sUptime'),        			dataIndex: 'uptime',   		tdCls: 'gridTree', width: 110,stateId: 'StateGMVND8'},
			{
				text: 'Last 24 Hours',
				//flex: 1,
				width: 150,
				dataIndex: 'dayuptimehist',
				xtype: 'widgetcolumn',
				stateId		: 'StateGMVND8a',
				sortable: false,
				widget: {
					xtype: 'sparklinebar',
					barColor: 'green',
					/*
					colorMap: {
						// Open ended range, with max value 5
						":5": "blue",
						// Open ended range, with min value 5
						"6:": "green"
					},
					*/
					barSpacing: 0,
					barWidth: 1,
					centered: true,
					disableTooltips: true,
					tipTpl: ''
				}
			},
			{
				text: 'Avail',
				//flex: 1,
				width: 75,
				dataIndex: 'uptimhistpct',
				align: 'center',
				xtype: 'widgetcolumn',
				stateId		: 'StateGMVND8b',
				sortable: false,
				widget: {
					xtype: 'sparklinepie',
					sliceColors: [ 'green', 'red' ],
					centered: true,
					tipTpl: 'Mins: {value:number("0.0")} ({percent:number("0.0")}%)'
				}
			},
			{ text: i18n('sSystem_time'),      		dataIndex: 'system_time',   tdCls: 'gridTree', width: 110,stateId: 'StateGMVND9', hidden: true
			},
			{ 
                text        : i18n('sSystem_load'),   
                dataIndex   : 'mem_total',  
                tdCls       : 'gridTree', 
                width		: 130,
                renderer    : function(value,metaData, record){
                	var mem_free 	= record.get('mem_free');
                    var load		= record.get('load_1')+" "+record.get('load_2')+" "+record.get('load_3');
					return Ext.ux.bytesToHuman(mem_free)+"/"+Ext.ux.bytesToHuman(value)+"<br>("+load+")";	             
                },stateId: 'StateGMVND10',
                hidden : true
            },
           	{ 
                text    : i18n('sFirmware'),
                sortable: false,
                flex    : 1,  
                xtype   : 'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            '<tpl if="Ext.isEmpty(release)"><div class=\"gridRealm noRight\">Not available</div></tpl>', 
                            '<tpl for="release">',     
                                "<tpl>{value}<br></tpl>",
                            '</tpl>'
                        ),
                dataIndex: 'release',stateId: 'StateGMVND11',
				hidden	: true
            }, 
            { 
                text    : i18n('sCPU'),
                sortable: false,
                flex    : 1,  
                xtype   :  'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            '<tpl if="Ext.isEmpty(cpu)"><div class=\"gridRealm noRight\">Not available</div></tpl>', 
                            '<tpl for="cpu">',     
                                "<tpl>{value}<br></tpl>",
                            '</tpl>'
                        ),
                dataIndex: 'cpu',stateId: 'StateGMVND12',
				hidden	: true
            },
            { 
                text        : "<i class=\"fa fa-gears\"></i> "+'Config Fetched',   
                dataIndex   : 'config_fetched',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(val,metaData, record){
                    var config_fetched_human     = record.get('config_fetched_human');  
                    var config;
                    var value = record.get('config_state');
                    if(value != 'never'){                    
                        if(value == 'up'){
                            config =  "<div class=\"fieldGreen\">"+config_fetched_human+"</div>";
                        }
                        if(value == 'down'){
                            config = "<div class=\"fieldGrey\">"+config_fetched_human+"</div>";
                        }

                    }else{
                        config = "<div class=\"fieldBlue\">Never</div>";
                    }
                    return config;
                                 
                },stateId: 'StateGMVND12a',
                hidden: false
            },
			{ 
                text        : "<i class=\"fa fa-heartbeat\"></i> "+'Heartbeat Received',   
                dataIndex   : 'last_contact',  
                tdCls       : 'gridTree', 
                flex        : 1,
                renderer    : function(val,metaData, record){    
                    var heartbeat;
                    var value = record.get('state');
                    if(value != 'never'){                    
                        var last_contact     = record.get('last_contact_human');
                        if(value == 'up'){
                            heartbeat =  "<div class=\"fieldGreen\">"+last_contact+"</div>";
                        }
                        if(value == 'down'){
                            heartbeat = "<div class=\"fieldRed\">"+last_contact+"</div>";
                        }

                    }else{
                        heartbeat = "<div class=\"fieldBlue\">Never</div>";
                    }
                    return heartbeat;
                                 
                },stateId: 'StateGMVND13',
                hidden: false
            },
			{ 
                text    : i18n('sLast_command'),
                sortable: false,
                tdCls   : 'gridTree', 
                flex    : 1,  
                xtype   : 'templatecolumn', 
                tpl:    new Ext.XTemplate(
                            "<tpl if='last_cmd_status == \"\"'><div class=\"fieldBlue\">(nothing)</div></tpl>", 
                            "<tpl if='last_cmd_status == \"awaiting\"'><div class=\"fieldBlue\"><i class=\"fa fa-clock-o\"></i> {last_cmd}</div></tpl>",
                            "<tpl if='last_cmd_status == \"fetched\"'><div class=\"fieldGreyWhite\"><i class=\"fa fa-check-circle\"></i> {last_cmd}</div></tpl>",
                            "<tpl if='last_cmd_status == \"replied\"'><div class=\"fieldTealWhite\"><i class=\"fa fa-comment\"></i> {last_cmd}</div></tpl>" 
                        ),
                stateId	: 'StateGMVND14',
				hidden	: false
            },
            { 
                text    : 'OpenVPN Connections',
                sortable: false,
                width   : 150,
                hidden  : true,
                flex    : 1,
                tdCls   : 'gridTree',
                xtype   : 'templatecolumn', 
                tpl:    new Ext.XTemplate(
                     '<tpl for="openvpn_list">',     // interrogate the realms property within the data
                        "<tpl if='lc_human == \"never\"'><div class=\"fieldBlue\">{name}</div>",
                        "<div style=\"font-size: 12px;\">(Never tested {name})</div>",
                        '<tpl else>',
                            "<tpl if='state == true'>",
                                "<div class=\"fieldGreen\">{name}</div>",
                                "<div style=\"font-size: 12px; color:#4d4d4d;\">Tested up {lc_human}</div>",
                            "</tpl>",
                            "<tpl if='state == false'>",
                                "<div class=\"fieldRed\">{name}</div>",
                                "<div style=\"font-size: 12px; color:#4d4d4d;\">Tested down {lc_human}</div>",
                            "</tpl>",
                        "</tpl>",
                    '</tpl>'
                ),
                dataIndex: 'openvpn_list',
                stateId : 'StateGMVND15'
            },
            {   
                text        : 'Internet Connection',       
                dataIndex   : 'wbw_signal',    
                tdCls       : 'gridTree', 
                stateId     : 'StateGMVND16',
                width       : 150,
                sortable    : false,
                renderer: function (v, m, r) {
                    if(v != null){
                        var bar = r.get('wbw_signal_bar');
                        var state = r.get('state');
                        if(state == 'up'){
                            var cls = 'wifigreen';
                            if(bar < 0.3){
                                cls = 'wifired';   
                            }
                            if((bar >= 0.3)&(bar <= 0.5)){
                                cls = 'wifiyellow';
                            }
                        }else{
                            cls = 'wifigrey';
                        }
                        var id = Ext.id();
                        Ext.defer(function () {
                            var p = Ext.widget('progressbarwidget', {
                                renderTo    : id,
                                value       : bar,
                                width       : 140,
                                text        : "<i class=\"fa fa-wifi\"></i> "+v+" dBm",
                                cls         : cls
                            });
                        
                            //Fetch some variables:
                            var t       = r.get('l_modified_human');

                            var t  = Ext.create('Ext.tip.ToolTip', {
                                target  : id,
                                border  : true,
                                anchor  : 'left',
                                html    : [
                                    "<div>",
                                        "<h2>Latest connection detail</h2>",
                                        "<label class='lblTipItem'>Channel</label><label class='lblTipValue'>"+r.get('wbw_channel')+"</label>",
                                        "<div style='clear:both;'></div>",
                                        "<label class='lblTipItem'>TX Power</label><label class='lblTipValue'>"+r.get('wbw_txpower')+"</label>",
                                        "<div style='clear:both;'></div>",
                                        "<label class='lblTipItem'>Quality</label><label class='lblTipValue'>"+r.get('wbw_quality')+"/70</label>",
                                        "<div style='clear:both;'></div>",
                                        "<label class='lblTipItem'>Noise</label><label class='lblTipValue'>"+r.get('wbw_noise')+"</label>",
                                        "<div style='clear:both;'></div>",
                                        "<label class='lblTipItem'>TX Packets</label><label class='lblTipValue'>"+r.get('wbw_tx_packets')+"</label>",
                                        "<div style='clear:both;'></div>",
                                        "<label class='lblTipItem'>TX Packets</label><label class='lblTipValue'>"+r.get('wbw_rx_packets')+"</label>",
                                        "<div style='clear:both;'></div>",
                                        "<label class='lblTipItem'>TX Rate</label><label class='lblTipValue'>"+r.get('wbw_tx_rate')+" Mbps</label>",
                                        "<div style='clear:both;'></div>",
                                        "<label class='lblTipItem'>TX Rate</label><label class='lblTipValue'>"+r.get('wbw_rx_rate')+" Mbps</label>",
                                        "<div style='clear:both;'></div>", 
                                        "<label class='lblTipItem'>Speed (~)</label><label class='lblTipValue'>"+r.get('wbw_expected_throughput')+" Mbps</label>",
                                        "<div style='clear:both;'></div>",
                                        "<label class='lblTipItem'>SSID</label><label class='lblTipValue'>"+r.get('wbw_ssid')+"</label>",
                                        "<div style='clear:both;'></div>",
                                    "</div>" 
                                ]
                            });

                        }, 100);
                        return Ext.String.format('<div id="{0}"></div>', id);
                    }else{
                        if(r.get('gateway') == 'no'){
                            return '<div class=\"fieldGrey\"><i class=\"fa fa-dice-d20\"></i> MESH</div>';
                        }
                        if(r.get('gateway') == 'yes'){
                            return '<div class=\"fieldBlue\"><i class=\"fa fa-network-wired\"></i> LAN</div>';
                        }
                        return 'N/A';
                    }
                }
            }
        ];
        me.callParent(arguments);
    }
});
