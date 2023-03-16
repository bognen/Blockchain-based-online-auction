package com.blockchain.auction.security;

import org.springframework.beans.factory.annotation.Value;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Base64;

@Converter
public class BlockchainAuctionCipher implements AttributeConverter<String, String> {

//    @Value("${jwt.cipher}")
//    private static String SECRET_KEY;
    private static String SECRET_KEY="GloRyToHeroEs";

    @Override
    public String convertToDatabaseColumn(String data) {
        try {
            Cipher cipher = Cipher.getInstance("Blowfish");
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(SECRET_KEY.getBytes(), "Blowfish"));
            byte[] encryptedData = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encryptedData);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        try {
            Cipher cipher = Cipher.getInstance("Blowfish");
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(SECRET_KEY.getBytes(), "Blowfish"));
            byte[] decryptedData = cipher.doFinal(Base64.getDecoder().decode(dbData));
            return new String(decryptedData);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
