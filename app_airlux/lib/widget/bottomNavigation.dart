import 'package:app_airlux/constants.dart';
import 'package:app_airlux/buildings/buildings_page.dart';
import 'package:app_airlux/pages/home_page.dart';
import 'package:app_airlux/scenarios/all_scenarios.dart';
import 'package:flutter/material.dart';
import 'package:bubble_bottom_bar/bubble_bottom_bar.dart';
import 'package:app_airlux/buildings/addBuilding_page.dart';
import 'package:provider/provider.dart';
import '../models/buildings/building_data.dart';
import '../models/scenarios/scenario_data.dart';

class BottomNavigation extends StatefulWidget {
  const BottomNavigation({super.key});

  @override
  State<BottomNavigation> createState() => _BottomNavigationState();
}

class _BottomNavigationState extends State<BottomNavigation> {
  int currentIndex = 0;
  String currentTitle = 'Accueil';
  late Widget actionWidget = Hero(
    tag: 'cottage',
    child: Container(
      margin: EdgeInsets.only(right: 15.0),
      child: Icon(
        Icons.cottage,
        color: Colors.white,
      ),
    ),
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        // bottomNavigationBar: NavigationTest(),
        bottomNavigationBar: BubbleBottomBar(
          //key: globalBottomNavBarKey,
          opacity: 0.2,
          backgroundColor: Colors.white,
          borderRadius: const BorderRadius.vertical(
            top: Radius.circular(16.0),
          ),
          currentIndex: currentIndex,
          hasInk: true,
          inkColor: Colors.black12,
          hasNotch: true,
          onTap: (index) {
            setState(() {
              currentIndex = index!;
              (index == 0) //Home
                  ? currentTitle = 'Accueil'
                  : (index == 1) //Bâtiments
                      ? currentTitle = 'Bâtiments'
                      : (index == 2) //Scénarios
                          ? currentTitle = 'Scénarios'
                          : (index == 3) //Profil
                              ? currentTitle = 'Profil'
                              : currentTitle = 'Accueil';

              (index == 1) //Bâtiments
                  ? actionWidget = IconButton(
                      icon: const Icon(Icons.add),
                      onPressed: () {
                        Navigator.of(context).push(MaterialPageRoute(
                          builder: (context) => const AddBuildingPage(),
                        ));
                      },
                    )
                  : (index == 2) //Scénarios
                      ? actionWidget = IconButton(
                          icon: const Icon(Icons.add),
                          onPressed: () {
                            Navigator.of(context).push(MaterialPageRoute(
                              builder: (context) => const AddBuildingPage(),
                            ));
                          },
                        )
                      : actionWidget = Hero(
                          tag: 'cottage',
                          child: Container(
                            margin: EdgeInsets.only(right: 15.0),
                            child: Icon(
                              Icons.cottage,
                              color: Colors.white,
                            ),
                          ),
                        );
            });
          },
          items: const [
            BubbleBottomBarItem(
              backgroundColor: kDarkPurple,
              icon: Icon(
                Icons.home_outlined,
                color: Colors.black,
              ),
              activeIcon: Icon(
                Icons.home,
                color: kDarkPurple,
              ),
              title: Text('Accueil'),
            ),
            BubbleBottomBarItem(
              backgroundColor: kDarkPurple,
              icon: Icon(
                Icons.business,
                color: Colors.black,
              ),
              activeIcon: Icon(
                Icons.business,
                color: kDarkPurple,
              ),
              title: Text('Bâtiments'),
            ),
            BubbleBottomBarItem(
              backgroundColor: kDarkPurple,
              icon: Icon(
                Icons.movie,
                color: Colors.black,
              ),
              activeIcon: Icon(
                Icons.movie,
                color: kDarkPurple,
              ),
              title: Text('Scénarios'),
            ),
            BubbleBottomBarItem(
              backgroundColor: kDarkPurple,
              icon: Icon(
                Icons.person,
                color: Colors.black,
              ),
              activeIcon: Icon(
                Icons.person,
                color: kDarkPurple,
              ),
              title: Text('Profil'),
            ),
          ],
        ),
        appBar: AppBar(
          backgroundColor: kDarkPurple,
          title: Text(currentTitle),
          actions: [
            actionWidget,
          ],
        ),
        body: SafeArea(
          top: true,
          child: (currentIndex == 0) //Home
              ? HomePage()
              : (currentIndex == 1) //Bâtiments
                  ? ChangeNotifierProvider(
                      create: (BuildContext context) => BuildingData(),
                      child: const MaterialApp(
                        home: BuildingsPage(),
                      ),
                    )
                  : (currentIndex == 2) //Scénarios
                      ? ChangeNotifierProvider(
                          create: (BuildContext context) => ScenarioData(),
                          child: MaterialApp(
                            home: AllScenariosPage(),
                          ),
                        )
                      : (currentIndex == 3) //Profil
                          ? AddBuildingPage()
                          : HomePage(), //Else
        ));
  }
}
