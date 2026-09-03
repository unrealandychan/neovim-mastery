import 'package:flutter/material.dart';

// Flutter Practice Lab:
// 1. Notice the subtle closing labels (e.g. // Scaffold, // Center, // Column) at closing brackets!
// 2. Refactoring Code Actions: place cursor on 'Text', press <Space>ca, select "Wrap with Padding" or "Wrap with Center".
// 3. Hot Reload: press <Space>fl
// 4. Hot Restart: press <Space>fR
// 5. Select Device / Simulator: press <Space>fs

class ProfileCard extends StatelessWidget {
  final String userName;
  final String userEmail;

  const ProfileCard({
    super.key,
    required this.userName,
    required this.userEmail,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Neovim Flutter Master'),
      ),
      body: Center(
        child: Card(
          elevation: 4.0,
          margin: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircleAvatar(
                radius: 40.0,
                child: Icon(Icons.person, size: 40.0),
              ),
              const SizedBox(height: 12.0),
              Text(
                userName,
                style: const TextStyle(
                  fontSize: 20.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                userEmail,
                style: TextStyle(
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
