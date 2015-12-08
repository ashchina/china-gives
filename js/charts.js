var chart_data_res;

var chart_opts;

var current_chart_data = [];

var get_initals = function(name){
  if (is_chinese()){
    if (!chart_data_res)
      chart_data_res = chart_data();
    var this_data = jQuery.grep(chart_data_res, function(item) {
                      return item["Name Eng"] == name;
                    });
    if (this_data.length > 0)
      return this_data[0]["Name CN"];
    return name;
  }

  var res = '';
  jQuery.each(name.split(' '), function(index, splitted) {
      if (splitted[0])
        res += splitted[0];
  });
  return res;
};

var get_focus = function (item){
  var i = 0;
  var focuses = ["Education", "Environment", "Healthcare", "Social Welfare", "Disaster Relief", "Culture"];
  jQuery.each(focuses, function(index, focus) {     
    if (item[focus] > 0)
      i++;
  });
  return i;
}

var get_industry_color = function (industry){
	var def_colors = [['Manufacturing', '#368DB9'], ['Real Estate', '#A51C30'], ['Energy', '#FAAE53'], ['Consumer', '#52854C'], ['Tech/IT','#293352'], 
                      ['Finance', '#48c4b7'], ['Education', '#861657'], ['Healthcare', '#CED665'], ['Transportation', '#8C8179'], ['Other', '#80475E']];
    var res = $.grep(def_colors, function(n){
			   	  return n[0] == industry;
			  });    	        
	if (res.length > 0)
		return res[0][1];
	var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;			   
}

var get_generosity_data = function (){
	if (!chart_data_res)
		chart_data_res = chart_data();
	var res = [];
	var filtered_data = $.grep(chart_data_res, function(n){
					    	return parseFloat(n['Generosity']);
					 	});
	var industries = $.map(filtered_data, function(n,i){
	   return n['Industry'];
	});
	industries = jQuery.unique(industries);
	$.each(industries, function (index, industry){
		var fetched_industrial = $.grep(filtered_data, function(n){
								   return n['Industry'] == industry;
								 });
		fetched_industrial = $.map(fetched_industrial, function(n,i){
							   return { x: n['Total Amount (million Yuan)'], y: parseFloat(n['Generosity']), z: n['Total Amount (million Yuan)'], name: get_initals(n["Name Eng"]),
							   			full_name: is_chinese() ? n["Name CN"] : n["Name Eng"], id: n.id };
							 });
		res.push({
			name: trsl(industry),
			color: get_industry_color(industry),
	        data: fetched_industrial
		});
	});

	chart_opts = {
		xAxis: {
            gridLineWidth: 1,
            title: {
                text: trsl('Total Amount')
            },
            labels: {
                format: '¥{value} m',
                formatter: null
            },
            tickInterval: null
        },
		yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: trsl('Generosity')
            },
            labels: {
                format: '{value}%'
            },
            maxPadding: 0.2
        },

	}

	return res;
};

var get_focus_data = function (){
	if (!chart_data_res)
		chart_data_res = chart_data();
	var res = [];
	var industries = $.map(chart_data_res, function(n,i){
	   return n['Industry'];
	});
	industries = jQuery.unique(industries);
	$.each(industries, function (index, industry){
		var fetched_industrial = $.grep(chart_data_res, function(n){
								   return n['Industry'] == industry;
								 });
		fetched_industrial = $.map(fetched_industrial, function(n,i){
							   return { x: n['Total Amount (million Yuan)'], y:  get_focus(n), z: n['Total Amount (million Yuan)'], name: get_initals(n["Name Eng"]),
							   			full_name: is_chinese() ? n["Name CN"] : n["Name Eng"], id: n.id };
							 });
		res.push({
			name: trsl(industry),
			color: get_industry_color(industry),
	        data: fetched_industrial
		});
	});

	chart_opts = {
		xAxis: {
            gridLineWidth: 1,
            title: {
                text: trsl('Total Amount')
            },
            labels: {
                format: '¥{value} m',
                formatter: null
            },
            tickInterval: null
        },
		yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: trsl('Philanthropic Causes')
            },
            labels: {
                format: '{value}%'
            },
            maxPadding: 0.2
        },

	}

	return res;
};

var get_industry_data = function (){
    if (!chart_data_res)
        chart_data_res = chart_data();
    var res = [];
    var industries = $.map(chart_data_res, function(n,i){
       return n['Industry'];
    });
    industries = jQuery.unique(industries);


    var get_industry_label = function (){
        return trsl(industries[this.value]);
    };

    $.each(industries, function (index, industry){
        var fetched_industrial = $.grep(chart_data_res, function(n){
                                   return n['Industry'] == industry;
                                 });
        fetched_industrial = $.map(fetched_industrial, function(n,i){
                               return { x: index, y:  n['Total Amount (million Yuan)'], z: n['Total Amount (million Yuan)'], name: get_initals(n["Name Eng"]),
                                        full_name: is_chinese() ? n["Name CN"] : n["Name Eng"], id: n.id };
                             });
        res.push({
            name: trsl(industry),
            color: get_industry_color(industry),
            data: fetched_industrial
        });
    });

    chart_opts = {
        xAxis: {
            gridLineWidth: 1,
            title: {
                text: trsl('Industry')
            },
            labels: {
                format: null,
                formatter: get_industry_label
            },
            tickInterval: 1
        },
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: trsl('Total Amount')
            },
            labels: {
                format: '¥{value} m',
            },
            maxPadding: 0.2
        },

    }

    return res;
};

var get_age_data = function(){

    if (!chart_data_res)
        chart_data_res = chart_data();
    var res = [];

    var count_to_delete = 0;

    var filtered_data = $.grep(chart_data_res, function(n){
                            return parseInt(n['Age']) > 0;
                        });

    var industries = $.map(filtered_data, function(n,i){
       return n['Industry'];
    });
    industries = jQuery.unique(industries);
    $.each(industries, function (index, industry){
        var fetched_industrial = $.grep(filtered_data, function(n){
                                   return n['Industry'] == industry;
                                 });
        fetched_industrial = $.map(fetched_industrial, function(n,i){
                               return { x: parseInt(n['Age']), y: n['Total Amount (million Yuan)'], z: n['Total Amount (million Yuan)'], name: get_initals(n["Name Eng"]),
                                        full_name: is_chinese() ? n["Name CN"] : n["Name Eng"], id: n.id };
                             });
        res.push({
            name: trsl(industry),
            color: get_industry_color(industry),
            data: fetched_industrial
        });
    });

    chart_opts = {
        xAxis: {
            gridLineWidth: 1,
            title: {
                text: trsl('Age')
            },
            labels: {
                format: '{value}',
                formatter: null
            },
            tickInterval: null
        },
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: trsl('Total Amount')
            },
            labels: {
                format: '¥{value} m',
            },
            maxPadding: 0.2
        }
    }

    return res;
}

var get_focus_type_data = function (type){
    if (!chart_data_res)
        chart_data_res = chart_data();
    var res = [];

    var count_to_delete = 0;

    var filtered_data = $.grep(chart_data_res, function(n){
                            return n[type];
                        });

    var industries = $.map(filtered_data, function(n,i){
       return n['Industry'];
    });
    industries = jQuery.unique(industries);
    $.each(industries, function (index, industry){
        var fetched_industrial = $.grep(filtered_data, function(n){
                                   return n['Industry'] == industry;
                                 });
        fetched_industrial = $.map(fetched_industrial, function(n,i){
                               return { x: n['Total Amount (million Yuan)'], y: n[type], z: n['Total Amount (million Yuan)'], name: get_initals(n["Name Eng"]),
                                        full_name: is_chinese() ? n["Name CN"] : n["Name Eng"], id: n.id };
                             });
        res.push({
            name: trsl(industry),
            color: get_industry_color(industry),
            data: fetched_industrial
        });
    });

    chart_opts = {
        xAxis: {
            gridLineWidth: 1,
            title: {
                text: trsl('Total Donations')
            },
            labels: {
                format: '¥{value} m',
                formatter: null
            },
            tickInterval: null
        },
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: trsl('Donations in ' + type)
            },
            labels: {
                format: '¥{value} m',
            },
            maxPadding: 0.2
        }
    }
    return res;
}

var init_charts = function (data){
	$('#series_chart_div').highcharts({
        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            animation: {
                duration: 2000
            }
        },

        legend: {
            enabled: true
        },
        exporting: { 
        	enabled: false 
        },
        title: {
            text: ''
        },

        subtitle: {
            text: ''
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: '<tr><th colspan="2"><h4>{point.full_name}</h4></th></tr>',
            footerFormat: '</table>',
            followPointer: true
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },
        series: data,
        xAxis: chart_opts.xAxis,
        yAxis: chart_opts.yAxis
    });
};

function match_by_id(new_data_item, old_data){    
    var res = null;
    var ind = null;
    var series_index = null;
    if (!new_data_item || !old_data)
        return {res: res, ind: ind, series_index: series_index};
    $.each(old_data, function (index, old_data_list){
        $.each(old_data_list.data, function (i, data){
            if (data.id == new_data_item.id){
                ind = i;
                res = new_data_item;
                series_index = index;
            }
        });
    });
    return {res: res, ind: ind, series_index: series_index};
}

function update_chart_point(data, chart){
    chart.get(data.res.id).update(data.res, false);
}

function remove_chart_point(data, chart){
    chart.get(data.id).remove(false);
}

function add_chart_point(data_list, chart, data){
    var serie = $.grep(chart.series, function (item){
        return item.name == data_list.name;
    });
    if (serie.length > 0){
        serie[0].addPoint(data, false);
    } else {
        chart.addSeries({
            name: trsl(data_list.name),
            color: get_industry_color(data_list.name),
            data: [data]
        }, false);
    }
}

function diff_chart_data(new_data){
	var chart = $('#series_chart_div').highcharts();

	$.each(new_data, function (index, new_data_list){
		$.each(new_data_list.data, function (i, data){
			var matched = match_by_id(data, current_chart_data);
            if (matched.res){
                update_chart_point(matched, chart);
            } else {
                add_chart_point(new_data_list, chart, data);
            }
		});
	});	


    $.each(current_chart_data, function (index, current_data_list){
        $.each(current_data_list.data, function (i, data){
            var matched = match_by_id(data, new_data);
            if (!matched.res){
                remove_chart_point(data, chart);
            }
        });
    }); 

    chart.redraw();

    var series_to_remove = [];
    $.each(chart.series, function (index, serie){
        if (!serie.points || serie.points.length <= 0){
            series_to_remove.push(serie.name);
        }
    }); 
    $.each(series_to_remove, function (index, serie_index){
        var serie = $.grep(chart.series, function (item){
            return item.name == serie_index;
        });
        if (serie.length > 0){
            serie[0].remove();
        }
    });

    chart.xAxis[0].update(chart_opts.xAxis, false);
    chart.yAxis[0].update(chart_opts.yAxis, false);

    chart.redraw();
}

$(function (){

    var init_data = get_generosity_data();
    init_charts([]);
    diff_chart_data(init_data);
    current_chart_data = init_data;

    $('[data-chart-type]').click(function (e){
        e.preventDefault();
        var new_data = eval($(this).data('chart-action'));
        diff_chart_data(new_data);
        current_chart_data = new_data;
    });

});