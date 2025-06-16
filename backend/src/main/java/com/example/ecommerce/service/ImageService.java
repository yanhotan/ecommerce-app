package com.example.ecommerce.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Service
public class ImageService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFsOperations operations;

    public String uploadImage(MultipartFile file) throws IOException {
        // Store file in GridFS
        String fileId = gridFsTemplate.store(
            file.getInputStream(),
            file.getOriginalFilename(),
            file.getContentType()
        ).toString();
        
        return fileId;
    }

    public String uploadImageFromBytes(byte[] imageBytes, String filename, String contentType) {
        // Store image bytes in GridFS
        String fileId = gridFsTemplate.store(
            new java.io.ByteArrayInputStream(imageBytes),
            filename,
            contentType
        ).toString();
        
        return fileId;
    }

    public String getImageAsBase64(String fileId) {
        try {
            GridFSFile gridFSFile = gridFsTemplate.findOne(
                new Query(Criteria.where("_id").is(fileId))
            );
            
            if (gridFSFile != null) {
                InputStream inputStream = operations.getResource(gridFSFile).getInputStream();
                byte[] imageBytes = inputStream.readAllBytes();
                inputStream.close();
                
                String contentType = gridFSFile.getMetadata() != null ? 
                    gridFSFile.getMetadata().getString("_contentType") : "image/png";
                
                return "data:" + contentType + ";base64," + Base64.getEncoder().encodeToString(imageBytes);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null;
    }

    public byte[] getImageBytes(String fileId) {
        try {
            GridFSFile gridFSFile = gridFsTemplate.findOne(
                new Query(Criteria.where("_id").is(fileId))
            );
            
            if (gridFSFile != null) {
                InputStream inputStream = operations.getResource(gridFSFile).getInputStream();
                byte[] imageBytes = inputStream.readAllBytes();
                inputStream.close();
                return imageBytes;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null;
    }

    public void deleteImage(String fileId) {
        gridFsTemplate.delete(new Query(Criteria.where("_id").is(fileId)));
    }
}
