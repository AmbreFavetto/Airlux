class UserBuilding {
  UserBuilding({required this.building_id,  required this.user_id, required this.id});
  String user_id = 'user_id';
  String building_id = 'building_id';
  String id = 'id';

  UserBuilding.fromJson(Map<String, dynamic> json) {
    user_id = json['user_id'];
    building_id = json['building_id'];
    id = json['id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['id'] = id;
    data['user_id'] = user_id;
    data['building_id'] = building_id;
    return data;
  }
}