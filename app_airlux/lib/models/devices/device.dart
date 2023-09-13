class Device {
  Device({this.id, this.name, this.room_id, this.category, this.value});
  String? name;
  String? room_id;
  String? id ;
  String? type = "";
  String? category;
  String? value;

  Device.fromJson(Map<String, dynamic> json) {
    id = json['device_id'];
    name = json['name'];
    type = json['type'];
    category = json['category'];
    room_id = json['room_id'];
    value = json['value'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    data['type'] = type;
    data['category'] = category;
    data['room_id'] = room_id;
    data['value'] = value;

    return data;
  }
}

