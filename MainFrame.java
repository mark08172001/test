import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MainFrame extends JFrame {
    private JTextArea textArea;
    
    public MainFrame() {
        setTitle("Hospital Management System");
        setSize(600, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        
        textArea = new JTextArea();
        textArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(textArea);
        add(scrollPane, BorderLayout.CENTER);
        
        JPanel buttonPanel = new JPanel();
        add(buttonPanel, BorderLayout.SOUTH);
        
        JButton btnViewPatients = new JButton("View Patients");
        JButton btnViewAdmissions = new JButton("View Admissions");
        buttonPanel.add(btnViewPatients);
        buttonPanel.add(btnViewAdmissions);
        
        btnViewPatients.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                viewPatients();
            }
        });
        
        btnViewAdmissions.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                viewAdmissions();
            }
        });
    }
    
    private void viewPatients() {
        try {
            ResultSet rs = DatabaseHelper.getPatients();
            textArea.setText("Patients:\n");
            while (rs.next()) {
                textArea.append("ID: " + rs.getInt("patient_id") + ", "
                        + "Name: " + rs.getString("first_name") + " " + rs.getString("last_name") + "\n");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    private void viewAdmissions() {
        try {
            ResultSet rs = DatabaseHelper.getAdmissions();
            textArea.setText("Admissions:\n");
            while (rs.next()) {
                textArea.append("ID: " + rs.getInt("admission_id") + ", "
                        + "Patient ID: " + rs.getInt("patient_id") + ", "
                        + "Ward: " + rs.getString("ward") + ", "
                        + "Admission Date: " + rs.getTimestamp("datetime_of_admission") + ", "
                        + "Discharge Date: " + rs.getTimestamp("datetime_of_discharge") + "\n");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            MainFrame frame = new MainFrame();
            frame.setVisible(true);
        });
    }
}
