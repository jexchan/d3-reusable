$(document).ready(function() {
  var width = 658, height = 450;

  var color = ["#1792e4", "#ff4248", "#51b23b", "#ff6e00", "#9574D4", "#008751", "#ac51ad", "#044187", "#ff3467"];
  var colorLight = ["#97d2ff", "#ff9298", "#a1f27b", "#ffae50", "#9574D4", "#008751", "#ac51ad", "#044187", "#ff3467"];
  var timeFormat = d3.time.format('%b %d');

  var dates = [
    new Date('10/5/2013'),
    new Date('10/6/2013'),
    new Date('10/7/2013'),
    new Date('10/8/2013'),
    new Date('10/9/2013'),
    new Date('10/10/2013'),
    new Date('10/11/2013'),
    new Date('10/12/2013'),
    new Date('10/13/2013'),
    new Date('10/14/2013')
  ];

  var dataRaw = [
    [125,165,202,198,275,387,404,358,342,300],
    [77,135,177,203,244,287,304,319,376,352],
    [25,95,172,215,210,187,104,101,89,68],
    [14,27,41,59,88,103,124,168,197,204]
  ];
  var dataNamesRaw = ['Free', 'Startup', 'Growth', 'Enterprise'];


  var graphNew = function(id, num, title) {
    var data = dataRaw.slice(0, num);
    var dataNames = dataNamesRaw.slice(0, num);

    var margin = {
      top: 50,
      bottom: 55,
      left: 70,
      right: 30
    };

    var tooltip = id + '-tooltip';
    var tooltipElem = $('#' + tooltip);
    var tooltipSingleTemplate = "<div class='tooltip-single'>  <strong><%- date %></strong>: <%- value %></div>";
    var tooltipTitleTemplate = "<div class='tooltip-title'><%- title %></div>";
    var tooltipSectionTemplate = "<div class='tooltip-section'>  <div class='tooltip-swatch' style='background-color: <%- color %>'></div>  <div class='tooltip-label' title='<%- name %>'><%- name %></div>  <div class='tooltip-value'><%- value %></div></div>";

    var curIndex = -1;
    var single = true, multi = false;

    var findSeries = function(data, d, i) {
      for(var j = 0; j < data.length; j++) {
        if(data[j][i] === d) return j;
      }
    };

    var resetTooltip = function() {
      if (single) {
        return tooltipElem.hide();
      } else {
        updateTooltip(margin.left + 10, false, -1, '');
        return curIndex = -1;
      }
    };

    var updateTooltip = function(xVal, yVal, index, date) {
      var animObj, d, value, _i, _len, _results;
      tooltipElem.show();
      animObj = {
        left: xVal,
        top: yVal ? yVal : void 0
      };
      tooltipElem.stop().animate(animObj, 50, 'linear');
      tooltipElem.html('');
      if (_.isDate(date)) {
        date = timeFormat(date);
      }
      if (single) {
        tooltipElem.append(_.template(tooltipSingleTemplate, {
          value: data[0][index],
          date: date
        }));
        return;
      }
      if (!date) {
        date = 'Legend';
      }
      tooltipElem.append(_.template(tooltipTitleTemplate, {
        title: date
      }));
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        d = data[_i];
        if (index < 0) {
          value = '';
        } else {
          value = d[index];
        }
        _results.push(tooltipElem.append(_.template(tooltipSectionTemplate, {
          name: dataNames[_i],
          value: value,
          color: color[_i]
        })));
      }
      return _results;
    };

    var render = function() {
      if(data.length > 1) {
        multi = true;
        $('#' + tooltip).css('top', 50);
        $('#' + tooltip).css('left', 80);
        $('#' + tooltip).show();
      }
      single = !multi;

      var minY = 0, maxY = 410;
      var minX = dates[0], maxX = dates[dates.length - 1];

      var x = d3.time.scale().domain([minX, maxX]).range([margin.left, width - margin.right]);
      var y = d3.scale.linear().domain([minY, maxY]).range([height - margin.bottom, margin.top]);

      var xAxis = d3.svg.axis()
        .tickFormat(d3.format('d'))
        .scale(x)
        .ticks(7)
        .tickFormat(timeFormat);

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(10)
        .tickSize(margin.right + margin.left - width);

      var line = d3.svg.line()
        .x(function(d,i) { return x(dates[i]); })
        .y(function(d,i) { return y(d); });

      var area = d3.svg.area()
        .x(function(d,i) { return x(dates[i]); })
        .y0(function(d) { return y(minY); })
        .y1(function(d) { return y(d); });

      var svg = d3.select('#' + id)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // LINE GRAPH
      var graphBg = svg.append('g').append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#fff');

      var titleElem = svg.append('g').append('text')
        .text(title)
        .attr('x', width / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('class', 'title');

      var xAxisElem = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + y(minY) + ')')
        .call(xAxis)
        .selectAll('text')
        .attr('transform', function(d) { return 'rotate(-45,' + this.getAttribute('x') + ',' + this.getAttribute('y') + ')'; })
        .style('text-anchor', 'end')

      var yAxisElem = svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + x(minX) + ',0)')
        .call(yAxis);

      var yAxisLabel = svg.append('g').append('text')
        .text('Watch Demo Video')
        .attr('x', margin.left - 45)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(270, ' + (margin.left - 45) + ', ' + (height / 2) + ')')
        .attr('class', 'label');

      var lineGraph = svg.append('g').selectAll('path')
        .data(data)
        .enter().append('path')
        .attr('d', function(d) { return line(d); })
        .attr('stroke', function(d, i) { return color[i]; })
        .attr('fill', 'none')
        .attr('stroke-width', '1.5px');

      if(!multi) {
        var lineArea = svg.append('g').selectAll('path')
          .data(data)
          .enter().append('path')
          .attr('class', 'area')
          .attr('d', function(d) { return area(d); })
          .attr('fill', function(d, i) { return color[i]; })
          .style('opacity', 0.15);
      }

      if(multi) {
        var circle = svg.append('g').selectAll('g')
          .data(data)
          .enter().append('g').append('circle')
          .attr('cx', x(dates[0]))
          .attr('cy', function(d) { return y(d[0]); })
          .attr('opacity', 0)
          .attr('r', 4)
          .attr('fill', function(d, i) {
            return color[i];
          });
      }
      else {
        var circle = svg.append('g').selectAll('g')
          .data(data)
          .enter().append('g').selectAll('circle')
          .data(function(d) { return d; })
          .enter().append('circle')
          .attr('cx', function(d,i) { return x(dates[i]); })
          .attr('cy', function(d) { return y(d); })
          .attr('r', 4)
          .attr('fill', function(d, i) {
            return color[findSeries(data, d, i)];
          });
      }

      resetTooltip();

      $('#' + id)
        .on('mouseenter', function(e) {
          if(multi) {
            circle.attr('opacity', 1);
          }
          else {
            $('#' + tooltip).show();
          }
        })
        .on('mouseleave', function(e) {
          resetTooltip();
          if(multi) {
            circle.attr('opacity', 0);
          }
          else {
            circle.attr('r', 4);
          }
        })
        .on('mousemove', function(e) {
          var mouseX = e.pageX - $('svg').offset().left;

          // find closest circle
          var closestDate = x.invert(mouseX);
          closestDate = _.min(dates, function(d) { return Math.abs(d - closestDate); });
          var index = dates.indexOf(closestDate);

          if(index != curIndex) {
            curIndex = index;

            var xVal = x(closestDate);

            var tooltipX = xVal - 40;
            if(multi) tooltipX = xVal - 60;
            var ttminX = margin.left;
            if(multi) ttminX = margin.left + 10;
            var ttmaxX = width - 120;
            if(multi) ttmaxX = width - margin.right - 150;

            if(tooltipX < ttminX) tooltipX = ttminX;
            if(tooltipX > ttmaxX) tooltipX = ttmaxX;

            var tooltipY = y(data[0][index]) - 45;
            if(multi) tooltipY = 50;

            updateTooltip(tooltipX, tooltipY, index, closestDate);
            if(multi) {
              circle.transition().duration(50)
                .attr('cx', xVal)
                .attr('cy', function(d) { return y(d[curIndex]); });
            }
            else {
              circle.transition().duration(50)
                .attr('r', function(d, i) {
                  if(i === index) return 6;
                  return 4;
                });
            }
          }
        });

    };

    var init = function() {
      render();
    };

    init();
  };

  var graphOld = function(id, num, title) {
    var data = dataRaw.slice(0, num);
    var dataNames = dataNamesRaw.slice(0, num);

    var margin = {
      top: 50,
      bottom: 75,
      left: 70,
      right: 30
    };

    var tooltip = id + '-tooltip';

    var findSeries = function(data, d, i) {
      for(var j = 0; j < data.length; j++) {
        if(data[j][i] === d) return j;
      }
    }

    var render = function() {

      var multi = false;
      if(data.length > 1) {
        margin.right = 140;
        multi = true;
      }

      var minY = 0, maxY = 410;
      var minX = dates[0], maxX = dates[dates.length - 1];

      var x = d3.time.scale().domain([minX, maxX]).range([margin.left, width - margin.right]);
      var y = d3.scale.linear().domain([minY, maxY]).range([height - margin.bottom, margin.top]);

      var xAxis = d3.svg.axis()
        .tickFormat(d3.format('d'))
        .scale(x)
        .ticks(7)
        .tickFormat(timeFormat);

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(10)
        .tickSize(margin.right + margin.left - width);

      var line = d3.svg.line()
        .x(function(d,i) { return x(dates[i]); })
        .y(function(d,i) { return y(d); })
        .interpolate('monotone');

      var area = d3.svg.area()
        .x(function(d,i) { return x(dates[i]); })
        .y0(function(d) { return y(minY); })
        .y1(function(d) { return y(d); })
        .interpolate('monotone');

      var svg = d3.select('#' + id)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // LINE GRAPH
      // var graphBg = svg.append('g').append('rect')
      //   .attr('x', 0)
      //   .attr('y', 0)
      //   .attr('width', width)
      //   .attr('height', height)
      //   .attr('fill', '#fff');

      var titleElem = svg.append('g').append('text')
        .text(title)
        .attr('x', width / 2)
        .attr('y', 28)
        .attr('text-anchor', 'middle')
        .attr('class', 'title');

      var xAxisElem = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + y(minY) + ')')
        .call(xAxis)
        .selectAll('text')
        .attr('transform', function(d) { return 'rotate(-45,' + this.getAttribute('x') + ',' + this.getAttribute('y') + ')'; })
        .style('text-anchor', 'end')

      var yAxisElem = svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + x(minX) + ',0)')
        .call(yAxis);

      var xAxisLabel = svg.append('g').append('text')
        .text('Date')
        .attr('x', (width - margin.left - margin.right) / 2 + margin.left)
        .attr('y', height - 12)
        .attr('text-anchor', 'middle')
        .attr('class', 'label');

      var yAxisLabel = svg.append('g').append('text')
        .text('Watch Demo Video')
        .attr('x', margin.left - 45)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(270, ' + (margin.left - 45) + ', ' + (height / 2) + ')')
        .attr('class', 'label');

      var lineGraph = svg.append('g').selectAll('path')
        .data(data)
        .enter().append('path')
        .attr('d', function(d) { return line(d); })
        .attr('stroke', function(d, i) { return color[i]; })
        .attr('fill', 'none')
        .attr('stroke-width', '3px');

      if(!multi) {
        var lineArea = svg.append('g').selectAll('path')
          .data(data)
          .enter().append('path')
          .attr('class', 'area')
          .attr('d', function(d) { return area(d); })
          .attr('fill', function(d, i) { return color[i]; })
          .style('opacity', 0.15);
      }
      else {
        // LEGEND
        var legendRects = svg.append('g').selectAll('rect')
          .data(dataNames)
          .enter().append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', function(d,i) { return color[i]; })
          .attr('x', width - 30)
          .attr('y', function(d, i) { return 50 + i * 20; });

        var legendLabels = svg.append('g').selectAll('text')
          .data(dataNames)
          .enter().append('text')
          .text(function(d) { return d; })
          .attr('font-size', '11px')
          .attr('text-anchor', 'end')
          .attr('x', width - 34)
          .attr('y', function(d, i) { return 62 + i * 20; });
      }


      var circle = svg.append('g').selectAll('g')
        .data(data)
        .enter().append('g').selectAll('circle')
        .data(function(d) { return d; })
        .enter().append('circle')
        .attr('cx', function(d,i) { return x(dates[i]); })
        .attr('cy', function(d) { return y(d); })
        .attr('r', 5)
        .attr('fill', '#fff')
        .attr('stroke', function(d, i) {
          return color[findSeries(data, d, i)];
        })
        .attr('stroke-width', '3px')
        .on('mouseover', function(d,i) {
          // TODO
          var series = findSeries(data, d, i);
          circle.attr('fill', '#fff');
          $(this).attr('fill', colorLight[series]);

          var mouseX = x(dates[i]);
          var mouseY = y(d);

          $('#' + tooltip).show();
          $('#' + tooltip).css('border-color', color[series]);
          if(multi) {
            $('#' + tooltip + ' .tooltip-title').html(dataNames[series]);
          }
          $('#' + tooltip + '-key').html(timeFormat(dates[i]) + ': ');
          $('#' + tooltip + '-value').html(d);
          $('#' + tooltip).animate(
            {
              'left': mouseX + 10,
              'top': mouseY + 10
            },
            100
          );
        });

    };

    var init = function() {
      render();
    };

    init();
  };

  graphOld('line-graph-old-single', 1, 'Watch Demo Video');
  graphOld('line-graph-old-multi', 4, 'Watch Demo Video, by Payment Plan');
  graphNew('line-graph-new-single', 1, 'Watch Demo Video');
  graphNew('line-graph-new-multi', 4, 'Watch Demo Video, by Payment Plan');
});