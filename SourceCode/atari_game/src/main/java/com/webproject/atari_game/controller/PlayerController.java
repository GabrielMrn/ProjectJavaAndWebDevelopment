package com.webproject.atari_game.controller;
import com.webproject.entity.Player;
import com.webproject.atari_game.service.PlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    } 

    @PostMapping()
    public ResponseEntity<Player> savePlayer(@RequestBody Player player) {
        Player newPlayer = playerService.savePlayer(player);
        return ResponseEntity.ok(newPlayer);
    }

    @GetMapping()
    public List<Player> getAllPlayers() {
        return playerService.getAllPlayers(); 
    }
}
