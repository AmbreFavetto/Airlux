class Floor {
  Floor({this.number,  this.id, this.building_id});
  int? number = null;
  int? id = null;
  int? building_id = null;

  Floor.fromJson(Map<String, dynamic> json) {
    id = json['floor_id'];
    number = json['number'];
    building_id = json['building_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['number'] = number;
    data['building_id'] = building_id;
    return data;
  }
}