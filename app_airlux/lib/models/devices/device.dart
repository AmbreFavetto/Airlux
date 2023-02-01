class Device {
  Device({this.name,  this.id, this.room_id});
  String? name;
  int? room_id;
  int? id = null;


  Device.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    room_id = json['room_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    data['room_id'] = room_id;
    return data;
  }
}

