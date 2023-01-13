class Scenario {
  Scenario({this.name,  this.id});
  String? name;
  int? id = null;


  Scenario.fromJson(Map<String, dynamic> json) {
    id = json['building_id'];
    name = json['name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    return data;
  }
}