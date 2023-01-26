class Room {
  Room({this.floor_id, this.name,  this.id, this.building_id});
  String? name;
  int? id = null;
  int? floor_id;
  int? building_id;


  Room.fromJson(Map<String, dynamic> json) {
    id = json['room_id'];
    name = json['name'];
    floor_id = json['floor_id'];
    building_id = json['building_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    data['floor_id'] = floor_id;
    data['building_id'] = building_id;
    return data;
  }
}