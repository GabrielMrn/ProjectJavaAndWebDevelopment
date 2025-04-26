package com.webproject.atari_game.controller;
import com.webproject.entity.Player;
import com.webproject.atari_game.service.PlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


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

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        Optional<Player> Player = playerService.getPlayerById(id);
        return Player.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id, @RequestBody Player player) {
        Player updatedPlayer = playerService.updatePlayer(id, player);
        return ResponseEntity.ok(updatedPlayer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.ok("Player has been deleted successfully.");
    }
    
}
