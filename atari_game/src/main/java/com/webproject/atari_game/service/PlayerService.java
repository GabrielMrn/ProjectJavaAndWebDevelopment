package com.webproject.atari_game.service;
import com.webproject.entity.Player;
import com.webproject.atari_game.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {
    
    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public Player updatePlayer(Long id, Player updatedPlayer) {
        Player player = playerRepository.findById(id).orElseThrow(() -> new RuntimeException("Player not found"));
        player.setName(updatedPlayer.getName());
        player.setScore(updatedPlayer.getScore());
        return playerRepository.save(player);
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }
}
