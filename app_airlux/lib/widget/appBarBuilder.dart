import 'package:app_airlux/constants.dart';
import 'package:flutter/material.dart';

class AppBarBuilder extends StatelessWidget {
  const AppBarBuilder({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20.0 * 2.5),
      // It will cover 20% of our total height
      height: MediaQuery.of(context).size.height * 0.2,
      child: Stack(
        children: <Widget>[
          Container(
            padding: const EdgeInsets.only(
              left: 20.0,
              right: 20.0,
              bottom: 36 + 20.0,
            ),
            height: MediaQuery.of(context).size.height * 0.2 - 50,
            decoration: const BoxDecoration(
              color: kDarkPurple,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(36),
                bottomRight: Radius.circular(36),
              ),
            ),
            child: Row(
              children: <Widget>[
                Text(
                  'Accueil',
                  style: Theme.of(context).textTheme.headline5?.copyWith(
                      color: Colors.white, fontWeight: FontWeight.bold),
                ),
                const Spacer(),
                Hero(
                  tag: 'logo',
                  child: Container(
                    margin: const EdgeInsets.only(right: 15.0),
                    child: const Image(
                      image: AssetImage('images/logo.png'),
                      width: 100,
                      //height: 20,
                    ),
                  ),
                )
                //Image.asset("assets/images/logo.png")
              ],
            ),
          ),
          // ----- Barre de recherche -----
          // Positioned(
          //   bottom: 0,
          //   left: 0,
          //   right: 0,
          //   child: Container(
          //     alignment: Alignment.center,
          //     margin: EdgeInsets.symmetric(horizontal: 20.0),
          //     padding: EdgeInsets.symmetric(horizontal: 20.0),
          //     height: 54,
          //     decoration: BoxDecoration(
          //       color: Colors.white,
          //       borderRadius: BorderRadius.circular(20),
          //       boxShadow: [
          //         BoxShadow(
          //           offset: Offset(0, 10),
          //           blurRadius: 50,
          //           color: kDarkPurple.withOpacity(0.23),
          //         ),
          //       ],
          //     ),
          //     child: Row(
          //       children: <Widget>[
          //         Expanded(
          //           child: TextField(
          //             onChanged: (value) {},
          //             decoration: InputDecoration(
          //               hintText: "Search",
          //               hintStyle: TextStyle(
          //                 color: kDarkPurple.withOpacity(0.5),
          //               ),
          //               enabledBorder: InputBorder.none,
          //               focusedBorder: InputBorder.none,
          //               // surffix isn't working properly  with SVG
          //               // thats why we use row
          //               // suffixIcon: SvgPicture.asset("assets/icons/search.svg"),
          //             ),
          //           ),
          //         ),
          //         //SvgPicture.asset("assets/icons/search.svg"),
          //       ],
          //     ),
          //   ),
          // ),
        ],
      ),
    );
  }
}
