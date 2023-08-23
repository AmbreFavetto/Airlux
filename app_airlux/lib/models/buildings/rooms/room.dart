class Room {
  Room({this.name,  this.id, this.floor_id});
  String? name;
  String? id = null;
  String? floor_id = null;

  Room.fromJson(Map<String, dynamic> json) {
    id = json['room_id'];
    name = json['name'];
    floor_id = json['floor_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    data['floor_id'] = floor_id;
    return data;
  }
}