package com.worlabel.domain.image.repository;

import com.worlabel.domain.image.entity.Image;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ImageBulkRepository {

    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public void saveAll(List<Image> imageList) {
        String sql = "INSERT INTO project_image (image_extension,folder_id,image_key,status,image_title)" +
                " values (?, ?, ?, ?, ?)";

        int batchSize = 1000; // 배치 크기 설정
        for (int i = 0; i < imageList.size(); i += batchSize) {
            List<Image> batchList = imageList.subList(i, Math.min(i + batchSize, imageList.size()));

            jdbcTemplate.batchUpdate(sql,
                    batchList,
                    batchList.size(),
                    (PreparedStatement ps, Image image) -> {
                        ps.setString(1, image.getExtension()); // image_extension (String)
                        ps.setInt(2, image.getFolder().getId()); // folder_id (Integer)
                        ps.setString(3, image.getImageKey()); // image_key (String)
                        ps.setString(4, image.getStatus().name()); // status (String or Enum)
                        ps.setString(5, image.getTitle()); // image_title (String)
                    });
        }
    }

}
