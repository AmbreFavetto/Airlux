class Scenario {
  Scenario({this.name,  this.id});
  String? name;
  String? id = null;


  Scenario.fromJson(Map<String, dynamic> json) {
    id = json['scenario_id'];
    name = json['name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    return data;
  }
}