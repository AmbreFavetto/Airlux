class Floor {
  Floor({this.name,  this.id, this.building_id});
  String? name = null;
  String? id = null;
  String? building_id = null;

  Floor.fromJson(Map<String, dynamic> json) {
    id = json['floor_id'];
    name = json['name'];
    building_id = json['building_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    data['building_id'] = building_id;
    return data;
  }
}