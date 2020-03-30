function optionChanged() {
  // Prevent the page from refreshing

  // Select the input value from the form
  var filter_id = d3.select('#selDataset').property('value');
  //   console.log('filter_id:', filter_id);

  // clear the input value
  myPlot(filter_id);
  // Build the plot with the new stock
}

// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as data
function myPlot(fid = '940') {
  d3.json('samples.json').then(data => {
    console.log('data:', data);

    var ids = data.samples.map(d => d.id);
    console.log('ids:', ids);

    var values = data.samples.map(d => d.sample_values[0]);
    console.log('values:', values);

    // Add ids to dropdown menu
    for (var i = 0; i < ids.length; i++) {
      selectBox = d3.select('#selDataset');
      selectBox.append('option').text(ids[i]);
    }

    // filter sample values by id
    var sample = data.samples.filter(i => i.id.toString() === fid)[0];
    console.log(sample);

    var id = sample.id;
    // console.log('id:', id);

    var washFrequency = data.metadata.filter(i => i.id.toString() === fid)[0]
      .wfreq;
    // console.log('washFrequency:', washFrequency);

    // getting sample-metadata
    var metadata = data.metadata.filter(i => i.id.toString() === fid)[0];
    // console.log('metadata:', metadata);

    var metadata_card = d3.select('#sample-metadata');

    // refreshing metadata_card
    metadata_card.html('');

    for (const [key, value] of Object.entries(metadata)) {
      console.log(key, value);
      metadata_card.append('p').text(`${key}: ${value}`);
    }

    // top 10 OTUs found in that individual
    // getting sample_values as the values for the bar chart.
    var sample_values = sample.sample_values.slice(0, 10).reverse();
    // console.log('sample_values:', sample_values);

    // getting otu_ids as the labels for the bar chart.
    var otu_ids = sample.otu_ids.slice(0, 10).reverse();
    console.log('otu_ids:', otu_ids);

    // getting otu_labels as the hovertext for the chart.
    var otu_labels = otu_ids.map(d => 'OTU ' + d);
    // console.log('otu_labels:', otu_labels);

    var trace1 = {
      x: sample_values,
      y: otu_labels,
      text: otu_ids,
      type: 'bar',
      orientation: 'h',
      marker: {
        color: '#83B588'
      }
    };

    // data
    var chartData = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
      title: `Top 10 OTUs found in Subject ${id}`,
      xaxis: { title: 'Sample Values' },
      yaxis: { title: '' }
    };

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot('bar', chartData, layout);

    // Create a bubble chart that displays each sample.
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.

    var traceB = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      },
      text: otu_labels
    };

    // set the layout for the bubble plot
    var layoutB = {
      title: ` Bubble chart for each sample`,
      xaxis: { title: `OTU ID ${fid}` },
      tickmode: 'linear',

      yaxis: { title: 'Sample Values' }
    };

    // creating data variable
    var dataB = [traceB];

    // create the bubble plot
    Plotly.newPlot('bubble', dataB, layoutB);

    // the Gauge Chart
    // part of data to input
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFrequency,
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
          axis: { range: [null, 9] },
          bar: { color: '#83A388' },
          steps: [
            { range: [0, 1], color: '#F8F3EB' },
            { range: [1, 2], color: '#F4F1E4' },
            { range: [2, 3], color: '#E9E7C8' },
            { range: [3, 4], color: '#D5E599' },
            { range: [4, 5], color: '#B6CD8F' },
            { range: [5, 6], color: '#8AC085' },
            { range: [6, 7], color: '#88BB8D' },
            { range: [7, 8], color: '#83B588' },
            { range: [8, 9], color: '#83A388' }
          ]
        }
      }
    ];

    var layout = {
      title: {
        text: `Belly Button Washing Frequency <br> Scrubs per Week`
      }
    };

    Plotly.newPlot('gauge', data, layout);
  });
}

myPlot();
