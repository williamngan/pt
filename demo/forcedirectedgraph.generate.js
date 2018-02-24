window.demoDescription = 'Force-directed Graph generation';

var space = new CanvasSpace('pt').setup({
  bgcolor: '#e6e6e6'
});
var form = new Form(space);
var graph = new ForceDirectedGraph(space.size.x, space.size.y);

for (var i = 0; i < 50; i++) {
  // Could be new Vector as well (or anything that inherits from Vector)
  graph.addVertex(new Vertex());
}
for (var i = 1; i < 50; i++) {
  graph.addEdge(new Edge(graph.vertices[i - 1], graph.vertices[i]));
}
graph.addEdge(new Edge(graph.vertices[0], graph.vertices[graph.vertices.length - 1]));
graph.randomize();
graph.generate();

space.add({
  animate: function(time, dt) {
    form.stroke(false);
    form.points(graph.vertices);
    form.stroke('#000');
    form.lines(graph.edges);
  }
});

space.play();
