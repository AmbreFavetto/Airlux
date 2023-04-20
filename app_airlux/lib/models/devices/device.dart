class Device {
  Device({this.name,  this.id, this.room_id, this.category});
  String? name;
  int? room_id;
  int? id = null;
  String? category;


  Device.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    room_id = json['room_id'];
    category = json['category'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    data['room_id'] = room_id;
    data['category'] = category;
    return data;
  }
}

