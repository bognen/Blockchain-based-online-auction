package com.blockchain.auction.model;


import com.blockchain.auction.security.BlockchainAuctionCipher;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    @Convert(converter = BlockchainAuctionCipher.class)
    private String username;
    @Column
    @JsonIgnore
    @Convert(converter = BlockchainAuctionCipher.class)
    private String password;

    public Long getId() { return  id; }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
